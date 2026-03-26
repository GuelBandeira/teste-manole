export const createMockRequest = (body = {}, headers = {}, params = {}, user = null) => {
   return {
      body,
      headers,
      params,
      user,
   };
};

export const createMockResponse = () => {
   const res = {
      status: function (code) {
         this.statusCode = code;
         return this;
      },
      json: function (data) {
         this.jsonData = data;
         return this;
      },
   };
   return res;
};

export const createMockNext = () => {
   return () => { };
};
