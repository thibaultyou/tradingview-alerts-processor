import { errorMiddleware } from '../errors.utils';
import { mockError, mockRequest, mockResponse } from '../../tests/tests.utils';

describe('Error utils', () => {
  describe('errorMiddleware', () => {
    it('should send an error response', () => {
      const err = mockError();
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn().mockReturnValue(undefined);
      errorMiddleware(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Something unexpected happened...');
      expect(next).toHaveBeenCalled();
    });
  });
});
