module.exports = {
  // 存储信息
  STORAGE_KEY: {
    AUTH_TOKEN: 'auth_token',
    USERINFO: 'userinfo',
    UID: 'uid',
    OPENID: 'openid',
    UNIONID: 'unionid',
    IS_LOGINED_BAAS: 'is_logined_baas',
    EXPIRES_AT: 'session_expires_at'
  },

  STATUS_CODE: {
    CREATED: 201,
    SUCCESS: 200,
    UPDATE: 200,
    PATCH: 200,
    DELETE: 204,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },

  UPLOAD: {
    UPLOAD_FILE_KEY: 'file',
    HEADER_AUTH: 'Authorization',
    HEADER_CLIENT: 'X-Hydrogen-Client-ID',
    HEADER_AUTH_VALUE: 'Hydrogen-r1 ',
    UA: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  },

  USER_PROFILE_BUILD_IN_FIELDS: [
    // 原有内置字段
    'id',
    'created_at',
    'created_by',
    'updated_at',
    'country',
    'nickname',
    'province',
    'city',
    'language',
    'openid',
    'unionid',
    'avatar',
    'is_authorized',
    'gender',

    // 新增内置字段
    'email',
    'username',
    'password',
    'phone_number',
    'last_login',
    'auth_data',
  ],


  httpMethodCodeMap: {
    GET: 200,
    POST: 201,
    PUT: 200,
    PATCH: 200,
    DELETE: 204,
  }
}
