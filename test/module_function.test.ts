import rewire from "rewire";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handler } from '../lambda/module_function'
import path from 'path';

type resBody = {
  status: string,
  message: string,
};

// FYI: https://zenn.dev/hamo/articles/68c2bd428f1339
// FYI: https://github.com/jhnns/rewire
describe('private function mock test', () => {
  describe('モックしない場合のテスト', () => { 
    test('プライベート関数が実行される事', async () => {
      const body = 'hogehoge'
      const event = {
        body,
      } as unknown as APIGatewayProxyEvent;
    
      const res = await handler(event);
      const resBody = JSON.parse(res.body) as resBody;
      expect(resBody.message).toBe(body.toUpperCase());
    });
  });
  
  describe('モックした場合のテスト', () => {    
    test('モックが反映されていること', async () => {
      const mockValue = 'fuga';
      const absPath = path.resolve(__dirname, "../lambda/module_function.ts");
      const testModule = rewire(absPath);
      const mock = jest.fn().mockReturnValue(mockValue);

      // private関数の置き換え
      const revert = testModule.__set__({
        convertToUppserCase: mock,
      });
      
      const body = 'hogehoge'
      const event = {
        body,
      } as unknown as APIGatewayProxyEvent;
      
      const res = await testModule.handler(event);
      const resBody = JSON.parse(res.body) as resBody;
      expect(resBody.message).toBe(mockValue);

      // 置き換えた関数を元に戻す
      // revert();

      // const res2 = await testModule.handler(event);
      // const resBody2 = JSON.parse(res2.body) as resBody;
      // expect(resBody2.message).toBe(body.toUpperCase());
    });
    
    test('モックが戻っていること', async () => {      
      const body = 'hogehoge'
      const event = {
        body,
      } as unknown as APIGatewayProxyEvent;
    
      const res = await handler(event);
      const resBody = JSON.parse(res.body) as resBody;
      expect(resBody.message).toBe(body.toUpperCase());
    });
  });
})