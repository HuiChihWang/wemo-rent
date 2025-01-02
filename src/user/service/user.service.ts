import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUserByUserName(userName: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userName });
  }

  public async changeUserRentStatus(userId: number, inRent: boolean) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User does not exist');
    }

    user.inRent = inRent;
    await this.userRepository.save(user);
  }
}
