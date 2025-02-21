import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from '../modules/order/services/order.service';
import { Order } from 'src/entitys/order.entity';
import { Wallet } from 'src/entitys/wallet.entity';
import { Transaction } from 'src/entitys/transaction.entity';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let walletRepository: Repository<Wallet>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(Order));
    walletRepository = module.get(getRepositoryToken(Wallet));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a buy order successfully', async () => {
      const orderDto = {
        type: 'buy' as const,
        amount: 1,
        price: 50000,
        fromCurrencyId: 1,
        toCurrencyId: 2,
      };

      const mockWallet = {
        id: 1,
        balance: 100000,
      };

      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(mockWallet as any);
      jest.spyOn(orderRepository, 'create').mockReturnValue({
        ...orderDto,
        id: 1,
        status: 'pending',
      } as any);
      jest.spyOn(orderRepository, 'save').mockResolvedValue({
        id: 1,
        ...orderDto,
        status: 'pending',
      } as any);

      const result = await service.createOrder(1, orderDto);

      expect(result).toBeDefined();
      expect(result.status).toBe('pending');
      expect(orderRepository.save).toHaveBeenCalled();
    });

    it('should throw error when insufficient balance', async () => {
      const orderDto = {
        type: 'buy' as const,
        amount: 1000,
        price: 50000,
        fromCurrencyId: 1,
        toCurrencyId: 2,
      };

      const mockWallet = {
        id: 1,
        balance: 100,
      };

      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(mockWallet as any);

      await expect(service.createOrder(1, orderDto)).rejects.toThrow('Insufficient balance');
    });
  });
});