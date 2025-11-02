// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Users } from 'src/api/users/entities/user.entity';
// import { Repository } from 'typeorm';
// import verifyAppleToken from 'verify-apple-id-token';
// import { ProviderTypes } from '../constants';

// @Injectable()
// export class SocialiteApple {
//   constructor(
//     @InjectRepository(Users)
//     private readonly userRepository: Repository<Users>,
//   ) {}

//   async generateUserFromToken(token: string) {
//     try {
//       const jwtClaims = await verifyAppleToken({
//         idToken: token,
//         clientId: [
//           process.env.APPLE_CLIENT_ID_IOS,
//           process.env.APPLE_CLIENT_ID_ANDROID,
//         ],
//       });

//       const user = await this.userRepository.find({
//         where: {
//           providerType: ProviderTypes.APPLE,
//           providerId: jwtClaims.sub,
//           isBlocked: false,
//         },
//       });

//       if (user.length > 0) {
//         return {
//           providerId: user[0].providerId,
//           email: user[0].email,
//         };
//       } else {
//         return {
//           providerId: jwtClaims.sub,
//           email: jwtClaims.email,
//         };
//       }
//     } catch (err) {
//       throw new UnauthorizedException('Error while authenticating apple user');
//     }
//   }
// }
