import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	// ฟังก์ชันสำหรับสร้าง JWT Token
	async generateToken(payload: { sub: string; username: string }) {
		return this.jwtService.sign(payload);
	}

	// ฟังก์ชันตรวจสอบ JWT (ถ้าจำเป็น)
	async verifyToken(token: string) {
		try {
			return this.jwtService.verify(token);
		} catch (error) {
			return null;
		}
	}
}
