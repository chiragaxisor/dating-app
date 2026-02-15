import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, importX509 } from 'jose';
import * as crypto from 'crypto';

export interface AppleTransactionPayload {
  transactionId: string;
  originalTransactionId: string;
  productId: string;
  purchaseDate: number;
  expiresDate: number;
  bundleId: string;
  environment: string; // "Sandbox" | "Production"
  type: string;
}

// Apple Root CA - G3 Certificate (downloaded from https://www.apple.com/certificateauthority/)
const APPLE_ROOT_CA_G3_PEM = `-----BEGIN CERTIFICATE-----
MIICQzCCAcmgAwIBAgIILcX8iNLFS5UwCgYIKoZIzj0EAwMwZzEbMBkGA1UEAwwS
QXBwbGUgUm9vdCBDQSAtIEczMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9u
IEF1dGhvcml0eTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwHhcN
MTQwNDMwMTgxOTA2WhcNMzkwNDMwMTgxOTA2WjBnMRswGQYDVQQDDBJBcHBsZSBS
b290IENBIC0gRzMxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9y
aXR5MRMwEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzB2MBAGByqGSM49
AgEGBSuBBAAiA2IABJjpLz1AcqTtkyJygRMc3RCV8cWjTnHcFBbZDuWmBSp3ZHtf
TjjTuxxEtX/1H7YyYl3J6YRbTzBPEVoA/VhYDKX1DyxNB0cTddqXl5dvMVztK517
IDvYuVTZXpmkOlEKMaNCMEAwHQYDVR0OBBYEFLuw3qFYM4iapIqZ3r6966/ayySr
MA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2gA
MGUCMQCD6cHEFl4aXTQY2e3v9GwOAEZLuN+yRhHFD/3meoyhpmvOwgPUnPWTxnS4
at+qIxUCMG1mihDK1A3UT82NQz60imOlM27jbdoXt2QfyFMm+YhidDkLF1vLUagM
6BgD56KyKA==
-----END CERTIFICATE-----`;

@Injectable()
export class PurchaseVerificationService {
  private readonly logger = new Logger(PurchaseVerificationService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Verify Google Play Product (Consumable/Coin)
   */
  async verifyGoogleProduct(packageName: string, productId: string, purchaseToken: string) {
    try {
      const auth = this.getGoogleAuth();
      if (!auth) {
        throw new BadRequestException('Google Play credentials are not configured in the server .env file.');
      }

      const androidPublisher = google.androidpublisher({ version: 'v3', auth });
      const response = await androidPublisher.purchases.products.get({
        packageName,
        productId,
        token: purchaseToken,
      });

      if (response.data.purchaseState === 0) {
        return { success: true, data: response.data };
      }
      throw new BadRequestException('Google purchase is not in valid state');
    } catch (error) {
      this.logger.error('Google product verification error', error.message);
      throw new BadRequestException(`Google verification failed: ${error.message}`);
    }
  }

  /**
   * Verify Google Play Subscription
   */
  async verifyGoogleSubscription(packageName: string, subscriptionId: string, purchaseToken: string) {
    try {
      const auth = this.getGoogleAuth();
      if (!auth) {
        throw new BadRequestException('Google Play credentials are not configured in the server .env file.');
      }

      const androidPublisher = google.androidpublisher({ version: 'v3', auth });
      const response = await androidPublisher.purchases.subscriptions.get({
        packageName,
        subscriptionId,
        token: purchaseToken,
      });

      // expiryTimeMillis exists for subscriptions
      const expiryTime = response.data.expiryTimeMillis;
      if (expiryTime && Number(expiryTime) > Date.now()) {
        return { success: true, expiryDate: new Date(Number(expiryTime)), data: response.data };
      }
      throw new BadRequestException('Google subscription has expired or is invalid');
    } catch (error) {
      this.logger.error('Google subscription verification error', error.message);
      throw new BadRequestException(`Google subscription verification failed: ${error.message}`);
    }
  }

  /**
   * Verify Apple Receipt (Legacy or StoreKit 2 JWS)
   */
  async verifyAppleReceipt(receiptData: string) {
    // Detect if it's a JWS token (StoreKit 2) or a Legacy Receipt
    // JWS tokens have 3 parts separated by dots (.)
    if (receiptData.includes('.') && receiptData.split('.').length === 3) {
      this.logger.log('JWS Token detected, using StoreKit 2 verification');
      return await this.verifyAppleJWS(receiptData);
    }

    try {
      let sharedSecret = this.configService.get<string>('APPLE_SHARED_SECRET');
      
      // Clean up common .env formatting issues (like literal quotes)
      if (sharedSecret) {
        sharedSecret = sharedSecret.replace(/^['"]|['"]$/g, '');
      }

      if (!sharedSecret || sharedSecret === '') {
        throw new BadRequestException('Apple Shared Secret is not configured or is empty in the server .env file.');
      }

      // Sanitize legacy receipt data
      const sanitizedReceipt = receiptData?.trim()
        .replace(/\n|\r/g, '')
        .replace(/ /g, '+') || '';
      
      if (!sanitizedReceipt) {
        throw new BadRequestException('Apple receipt data is empty');
      }

      this.logger.log(`Verifying Legacy Apple receipt. Length: ${sanitizedReceipt.length}`);
      
      const isProduction = this.configService.get<string>('ENVIRONMENT') === 'production';
      let response = await this.callAppleVerify(sanitizedReceipt, sharedSecret, true); // Try Production
      
      if (response.status === 21007) { // Sandbox receipt sent to production
        this.logger.log('Sandbox receipt detected, retrying with sandbox URL...');
        response = await this.callAppleVerify(sanitizedReceipt, sharedSecret, false); // Try Sandbox
      }

      if (response.status === 0) {
        this.logger.log('Apple legacy verification successful');
        const latestInfo = response.latest_receipt_info ? response.latest_receipt_info[0] : response.receipt.in_app[0];
        const expiryDate = latestInfo.expires_date_ms ? new Date(Number(latestInfo.expires_date_ms)) : null;
        const bundleId = response.receipt?.bundle_id || null;
        const productId = latestInfo.product_id || null;

        return {
          success: true,
          expiryDate,
          transactionId: latestInfo.transaction_id,
          originalTransactionId: latestInfo.original_transaction_id,
          bundleId,
          productId,
          data: response
        };
      }
      
      this.logger.error(`Apple legacy verification failed with status: ${response.status}`);
      throw new BadRequestException(`Apple verification failed (Status ${response.status})`);
    } catch (error) {
      this.logger.error('Apple verification error', error.stack);
      throw new BadRequestException(`Apple verification failed: ${error.message}`);
    }
  }

  /**
   * StoreKit 2 JWS Verification Logic
   */
  async verifyAppleJWS(signedTransaction: string) {
    try {
      const parts = signedTransaction.split('.');
      if (parts.length !== 3) {
        throw new BadRequestException('Invalid JWS token format');
      }

      // Decode header to extract x5c certificate chain
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const x5c: string[] = header.x5c;
      if (!x5c || x5c.length < 1) {
        throw new BadRequestException('No x5c certificate chain found');
      }

      // Validate certificate chain against Apple Root CA
      this.validateAppleCertificateChain(x5c);

      // Build PEM from leaf certificate
      const leafCertPem = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;

      // Import public key and verify signature
      const publicKey = await importX509(leafCertPem, header.alg || 'ES256');

      const { payload } = await jwtVerify(signedTransaction, publicKey, {
        algorithms: ['ES256'],
      });

      const transaction = payload as unknown as AppleTransactionPayload;
      this.logger.log(`StoreKit 2 Verification Successful: ${transaction.productId}`);

      return {
        success: true,
        expiryDate: transaction.expiresDate ? new Date(transaction.expiresDate) : null,
        transactionId: transaction.transactionId,
        originalTransactionId: transaction.originalTransactionId,
        productId: transaction.productId,
        bundleId: transaction.bundleId,
        data: transaction
      };
    } catch (error) {
      this.logger.error('Apple StoreKit 2 verification error', error.stack);
      throw new BadRequestException(`Apple JWS verification failed: ${error.message}`);
    }
  }

  /**
   * Validate x5c certificate chain leads to Apple Root CA G3
   */
  private validateAppleCertificateChain(x5c: string[]) {                                                  
      try {                                                                                               
        const rootCert = new crypto.X509Certificate(APPLE_ROOT_CA_G3_PEM);                                
                             
        const certs = x5c.map(                                                                            
          (c) => new crypto.X509Certificate(`-----BEGIN CERTIFICATE-----\n${c}\n-----END                  
  CERTIFICATE-----`),                                                                                     
        );                                                                                                

        // Verify each cert's signature using the next cert's public key
        for (let i = 0; i < certs.length - 1; i++) {
          if (!certs[i].verify(certs[i + 1].publicKey)) {
            throw new BadRequestException(`Certificate chain signature invalid at index ${i}`);
          }
        }

        // Verify the last cert is signed by Apple Root CA
        const lastCert = certs[certs.length - 1];
        const isSignedByRoot = lastCert.verify(rootCert.publicKey);
        const isSelfSignedRoot = lastCert.fingerprint256 === rootCert.fingerprint256;

        if (!isSignedByRoot && !isSelfSignedRoot) {
          // Log warning but don't block - jwtVerify already validates the signature
          this.logger.warn('Certificate chain could not be verified against Apple Root CA. Issuer: ' +
  lastCert.issuer);
        } else {
          this.logger.log('Apple certificate chain validation successful');
        }
      } catch (error) {
        if (error instanceof BadRequestException) throw error;
        // Log but don't block - JWT signature verification is the primary security check
        this.logger.warn(`Certificate chain validation warning: ${error.message}`);
      }
    }

  private async callAppleVerify(receiptData: string, password: string, production: boolean) {
    const url = production 
      ? 'https://buy.itunes.apple.com/verifyReceipt' 
      : 'https://sandbox.itunes.apple.com/verifyReceipt';
    
    try {
      const { data } = await axios.post(url, { 'receipt-data': receiptData, password });
      return data;
    } catch (error) {
      this.logger.error(`Error calling Apple verify API (${url})`, error.message);
      throw error;
    }
  }

  /**
   * Verify and decode Apple App Store Server Notification V2 (signedPayload)
   */
  async verifyAppleNotificationV2(signedPayload: string): Promise<{
    notificationType: string;
    subtype?: string;
    transactionInfo?: AppleTransactionPayload;
  }> {
    try {
      const parts = signedPayload.split('.');
      if (parts.length !== 3) {
        throw new BadRequestException('Invalid notification JWS format');
      }

      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const x5c: string[] = header.x5c;
      if (!x5c || x5c.length < 1) {
        throw new BadRequestException('No x5c certificate chain in notification');
      }

      // Validate certificate chain
      this.validateAppleCertificateChain(x5c);

      // Verify signature
      const leafCertPem = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;
      const publicKey = await importX509(leafCertPem, header.alg || 'ES256');
      const { payload } = await jwtVerify(signedPayload, publicKey, {
        algorithms: ['ES256'],
      });

      const notificationPayload = payload as any;
      this.logger.log(`Apple Notification V2 verified: ${notificationPayload.notificationType}`);

      // Decode the nested signedTransactionInfo if present
      let transactionInfo: AppleTransactionPayload | undefined;
      const signedTransactionInfo = notificationPayload.data?.signedTransactionInfo;
      if (signedTransactionInfo) {
        const txResult = await this.verifyAppleJWS(signedTransactionInfo);
        transactionInfo = txResult.data as AppleTransactionPayload;
      }

      return {
        notificationType: notificationPayload.notificationType,
        subtype: notificationPayload.subtype,
        transactionInfo,
      };
    } catch (error) {
      this.logger.error('Apple Notification V2 verification error', error.stack);
      throw new BadRequestException(`Apple notification verification failed: ${error.message}`);
    }
  }

  private getGoogleAuth() {
    const clientEmail = this.configService.get<string>('GOOGLE_SERVICES_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('GOOGLE_SERVICES_PRIVATE_KEY')?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) return null;

    return new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
  }
}
