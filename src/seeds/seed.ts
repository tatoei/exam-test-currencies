import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Cryptocurrency } from 'src/entitys/cryptocurrency.entity';
import { FiatCurrency } from 'src/entitys/fiat-currency.entity';
import { User } from 'src/entitys/user.entity';
import { Wallet } from 'src/entitys/wallet.entity';


export default class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // สร้างข้อมูล Cryptocurrency
    await connection
      .createQueryBuilder()
      .insert()
      .into(Cryptocurrency)
      .values([
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          network_fee: 0.0001,
          blockchain_network: 'Bitcoin',
          is_active: true
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          network_fee: 0.01,
          blockchain_network: 'Ethereum',
          is_active: true
        },
        {
          symbol: 'XRP',
          name: 'Ripple',
          network_fee: 0.00001,
          blockchain_network: 'Ripple',
          is_active: true
        },
        {
          symbol: 'DOGE',
          name: 'Dogecoin',
          network_fee: 1,
          blockchain_network: 'Dogecoin',
          is_active: true
        }
      ])
      .execute();

    // สร้างข้อมูล Fiat Currency
    await connection
      .createQueryBuilder()
      .insert()
      .into(FiatCurrency)
      .values([
        {
          symbol: 'THB',
          name: 'Thai Baht',
          country: 'Thailand',
          is_active: true
        },
        {
          symbol: 'USD',
          name: 'US Dollar',
          country: 'United States',
          is_active: true
        }
      ])
      .execute();

    // สร้างผู้ใช้ทดสอบ
    const users = await factory(User)()
      .map(async (user) => {
        user.username = `test_user_${Math.floor(Math.random() * 1000)}`;
        user.email = `test${Math.floor(Math.random() * 1000)}@example.com`;
        user.password_hash = 'hashed_password';
        user.verify_status = 'approved';
        return user;
      })
      .createMany(5);

    // สร้างกระเป๋าเงินสำหรับผู้ใช้แต่ละคน
    const cryptos = await connection.getRepository(Cryptocurrency).find();
    const fiats = await connection.getRepository(FiatCurrency).find();

    for (const user of users) {
      // สร้างกระเป๋า crypto
      for (const crypto of cryptos) {
        await connection
          .createQueryBuilder()
          .insert()
          .into(Wallet)
          .values({
            user: user,
            cryptocurrency: crypto,
            address: `${crypto.symbol}_${Math.random().toString(36).substring(7)}`,
            balance: Math.random() * 10
          })
          .execute();
      }

      // สร้างกระเป๋า fiat
      for (const fiat of fiats) {
        await connection
          .createQueryBuilder()
          .insert()
          .into(Wallet)
          .values({
            user: user,
            fiat_currency: fiat,
            address: `${fiat.symbol}_${Math.random().toString(36).substring(7)}`,
            balance: Math.random() * 100000
          })
          .execute();
      }
    }
  }
}