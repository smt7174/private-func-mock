import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
  // console.info(JSON.stringify(event));
  const str = event.body as string;
  
  const ucString = convertToUppserCase(str);
  const res = createResponse(200, ucString);
  
  return res;
};

// constでprivate関数を定義すると、rewire.__set__が
// 「TypeError: Assignment to constant variable」エラーになる
// const convertToUppserCase = (str: string): string => {
//   return str.toUpperCase();
// };

// constを使わないprivate関数定義なら、rewire.__set__でmock可能
function convertToUppserCase(str: string) {
  return str.toUpperCase();
};

const createResponse = (statusCode: number, message: string = ""): APIGatewayProxyResult => {
    // 関数が戻り値を持つ場合、tracer.putMetadataを設定しなくても、
    // 関数の戻り値は「関数名 response」という名前でメタデータに記録される。
    // それ以外の名前＆値をメタデータに記録したい場合にtracer.putMetadataを設定する
    return {
      statusCode: statusCode,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        status: statusCode === 200 ? 'success' : 'fail',
        message,
      }),
    } as APIGatewayProxyResult;
  }