/**
 * Overall comments:
 * 1. Functions name should be more clear meaning, e.g getNumbers, addNumber, deleteNumber...
 * 2. Parameters name should be consistent and better close to db field name, e.g userId, number...
 */

interface IPhoneDao {
  phone(user: string): Promise<string[]>;
  add(user: string, phone: string): Promise<void>;
  delete(phone: string): Promise<void>;
}

// Missing implements IPhoneDao
class PhoneDao {
  private logger: ILogger;
  dbClient: IDbClient;

  constructor(logger: ILogger, dbClient: IDbClient) {
    this.logger = logger;
    this.dbClient = dbClient;
  }

  async phone(user: string): Promise<string[]> {
    this.logger.debug('About to get user phone number');
    try {
      const result = await this.dbClient.query('SELECT number FROM phone WHERE user_id = \'' + user + '\';');
      // This won't work, as map function create new array, so we need to have assign value to result to use it: result = result.sort().map()...
      result.sort().map((result) => result.number);
      const phones = [];
      // For better readable code, we should have bracket {} even only 1 line inside
      for (let i = 0; i < result.length; i++)
        // Wrong condition with !, should add to array if value starts with '+'
        if (!result[i].startsWith('+')) phones.push(result[i]);
      
      // Wrong return, should be phones instead.
      return result;

      // For the whole function, we are having reduntdant iteration for seriallize array and validate + push data as both can be merged in one for better performance. Suggestion:
      //
      // const phones = [];
      // result.sort().map((item) => {
      //   const number: string = item.number;
      //   if (number.startsWith('+')) {
      //     phones.push(number);
      //   }
      // });
    } catch (e: Error) {
      console.error('Cannot find user phone number');
    }
    return [];
  }

  async add(user: string, phone: string): Promise<void> {
    // Wrong debug log, should be Add
    this.logger.debug('About to get user phone number');
    try {
      for (let i = 1; i < phone.length; i++) {
        // Wrong check, as we in iteration of string without first character, we don't need to use slice anymore.
        // Also a TypeScript transpile error, will be corrected as: isNaN(phone[i] as unknown as number)
        if (isNaN(phone[i].slice(1))) {
          throw new Error('wrong format');
        }
      }
      if (!phone.startsWith('+')) {
        throw new Error('wrong format');
      }
      // Wrong condition, I assume the phone number min length is 10
      if (!phone.length < 10) {
        throw new Error('wrong format');
      }
      // All above validations can be simpler with regex. Suggestion:
      // const regex = /^\+\d{9,}$/;
      // if (!regex.test(phone)) {
      //   throw new Error('wrong format');
      // }

      // Wrong variable name, the parameter is user instead of user_id
      await this.dbClient.query('INSERT INTO phone (user_id, number) VALUES (\'' + user_id + '\',\'' + phone + '\');');
    } catch (err: Error) {
      console.error('Cannot insert user phone number');
    }
  }

  async delete(phone: string): Promise<void> {
    await this.dbClient.query('DELETE FROM phone WHERE number = \'' + phone + '\';');
  }
}
