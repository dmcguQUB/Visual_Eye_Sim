//will change this to url when we have a real url
const BASE_URL = 'http://localhost:5001';

//url for all case studies
export const CASE_STUDIES_URL = BASE_URL + '/api/case_studies';
//get individual URL
export const CASE_STUDY_BY_ID_URL = CASE_STUDIES_URL + '/';

export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';