import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from 'src/entitys/transaction.entity';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import { WalletService } from 'src/modules/wallet/wallet.service';


describe('TransactionService', () => {
  let service: TransactionService;
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: WalletService,
          useValue: {
            updateWalletBalance: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    walletService = module.get<WalletService>(WalletService);
  });

  it('should process transaction successfully', async () => {
    const mockTransaction = {
      id: 1,
      from_wallet: { id: 1 },
      to_wallet: { id: 2 },
      amount: 100,
      status: 'pending',
    };

    jest.spyOn(walletService, 'updateWalletBalance').mockResolvedValue(null);

    const result = await service.processTransaction(mockTransaction as any);

    expect(result.status).toBe('completed');
    expect(walletService.updateWalletBalance).toHaveBeenCalledTimes(2);
  })
});
