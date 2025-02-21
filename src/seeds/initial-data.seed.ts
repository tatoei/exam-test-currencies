import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Cryptocurrency } from 'src/entitys/cryptocurrency.entity';
import { FiatCurrency } from 'src/entitys/fiat-currency.entity';
import { User } from 'src/entitys/user.entity';
import { Wallet } from 'src/entitys/wallet.entity';
import { Order } from 'src/entitys/order.entity';
import { Transaction } from 'src/entitys/transaction.entity';

export default class InitialDataSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // Seed Cryptocurrencies
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
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          network_fee: 0.005,
          blockchain_network: 'Ethereum',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          symbol: 'XRP',
          name: 'Ripple',
          network_fee: 0.00001,
          blockchain_network: 'Ripple',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          symbol: 'DOGE',
          name: 'Dogecoin',
          network_fee: 1,
          blockchain_network: 'Dogecoin',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .execute();

    // Seed Fiat Currencies
    await connection
      .createQueryBuilder()
      .insert()
      .into(FiatCurrency)
      .values([
        {
          symbol: 'THB',
          name: 'Thai Baht',
          country: 'Thailand',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          symbol: 'USD',
          name: 'US Dollar',
          country: 'United States',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .execute();

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          username: 'trader1',
          email: 'trader1@example.com',
          password_hash: hashedPassword,
          verify_status: 'verified',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'trader2',
          email: 'trader2@example.com',
          password_hash: hashedPassword,
          verify_status: 'verified',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'trader3',
          email: 'trader3@example.com',
          password_hash: hashedPassword,
          verify_status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .execute();

    // Seed Wallets (using the correct schema)
    await connection
      .createQueryBuilder()
      .insert()
      .into(Wallet)
      .values([
        {
          user: { id: 1 },
          cryptocurrency: { id:1 }, // BTC
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          balance: 1.5,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user: { id: 1 },
          cryptocurrency: { id: 5}, // THB
          address: 'THB_WALLET_1',
          balance: 1000000,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user: { id: 2 },
          cryptocurrency: { id: 1 }, // BTC
          address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          balance: 2.5,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user: { id: 2 },
          cryptocurrency: {id: 6}, // USD
          address: 'USD_WALLET_1',
          balance: 50000,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .execute();

    // Seed Orders
    await connection
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values([
        {
          user: {id: 1},
          type: 'sell',
          status: 'pending',
          from_cryptocurrency: {id:1}, // BTC
          to_fiat: {id:5}, // THB
          amount: 0.5,
          price: 1000000,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user: {id: 2},
          type: 'buy',
          status: 'completed',
          from_cryptocurrency :{id: 6}, // USD
          to_cryptocurrency: {id: 1}, // BTC
          amount:0.3,
          price: 30000,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .execute();

    // Seed Transactions
    await connection
      .createQueryBuilder()
      .insert()
      .into(Transaction)
      .values([
        {
          order: {id: 1},
          from_wallet: {id:1},
          to_wallet:{id: 3},
          amount: 0.1,
          transaction_type: 'trade',
          status: 'completed',
          created_at: new Date()
        },
        {
          order: {id:2},
          from_wallet: {id:4},
          to_wallet: {id:2},
          amount: 3000,
          transaction_type: 'trade',
          status: 'completed',
          created_at: new Date()
        }
      ])
      .execute();
  }
}