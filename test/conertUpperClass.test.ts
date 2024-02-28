import rewire from 'rewire';
import { ConvertUpper } from '../class/convertUpperClass';
import path from 'path';

type resBody = {
  status: string;
  message: string;
};

// FYI: https://zenn.dev/hamo/articles/68c2bd428f1339
// FYI: https://github.com/jhnns/rewire
describe('private function mock test', () => {
  describe('モックしない場合のテスト', () => {
    test('プライベート関数が実行される事', async () => {
      const str = 'hogehoge';
      const target = new ConvertUpper();
      const converted = target.convert(str);
      expect(converted).toBe(str.toUpperCase());
    });
  });

  describe('モックした場合のテスト', () => {
    test('as anyでモックが反映されていること', async () => {
      const str = 'hogehoge';
      const target = new ConvertUpper();
      (target as any).convertToUpperCase = jest
        .fn()
        .mockReturnValue('fugafuga');
      const converted = target.convert(str);
      expect(converted).toBe('fugafuga');
    });

    test('モックが戻っていること', async () => {
      const str = 'hogehoge';
      const target = new ConvertUpper();
      const converted = target.convert(str);
      expect(converted).toBe(str.toUpperCase());
    });

    test('Object.definePropertyでモックが反映されていること', async () => {
      const str = 'hogehoge';
      const target = new ConvertUpper();
      const replica = Object.create(target);
      Object.defineProperty(replica, 'convertToUpperCase', {
        value: jest.fn().mockReturnValue('piyopiyo'),
      });
      const converted = replica.convert(str);
      expect(converted).toBe('piyopiyo');
    });

    test('モックが戻っていること', async () => {
      const str = 'hogehoge';
      const target = new ConvertUpper();
      const converted = target.convert(str);
      expect(converted).toBe(str.toUpperCase());
    });

    test('連想配列でモックが反映されていること', async () => {
      const str = 'hogehoge';
      const target = new ConvertUpper();
      target['convertToUpperCase'] = jest.fn().mockReturnValue('foofoo');
      const converted = target.convert(str);
      expect(converted).toBe('foofoo');
    });

    test('モックが戻っていること', async () => {
      const str = 'hogehoge';
      const target = new ConvertUpper();
      const converted = target.convert(str);
      expect(converted).toBe(str.toUpperCase());
    });

    test('rewireでモックが反映されていること', async () => {
      const str = 'hogehoge';
      const baseClass = new ConvertUpper();
      const baseMethod = baseClass['convert'];
      const mock = jest.fn().mockReturnValue('barbar');

      const absPath = path.resolve(__dirname, '../class/convertUpperClass');
      const target = rewire(absPath);
      
      // private関数の置き換え(先にやる必要がある)
      const revert = target.__set__({
        ConvertUpper: {
          convert: baseMethod,
          convertToUpperCase: mock,
        },
      });

      const targetClass = target.__get__('ConvertUpper');
      const converted = targetClass.convert(str);
      expect(converted).toBe('barbar');
    });

    test('モックが戻っていること', async () => {
      const str = 'hogehoge';
      const target = new ConvertUpper();
      const converted = target.convert(str);
      expect(converted).toBe(str.toUpperCase());
    });
  });
});
