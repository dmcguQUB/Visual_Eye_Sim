//will change this to url when we have a real url
const BASE_URL = 'http://localhost:5001';

//url for all case studies
export const CASE_STUDIES_URL = BASE_URL + '/api/case_studies';
//get individual URL
export const CASE_STUDY_BY_ID_URL = CASE_STUDIES_URL + '/';

//need to export constants for both user login and register from API in backend
export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';

//url for all questions
export const QUESTIONS_URL= BASE_URL + '/api/questions';
//url for all questions bu case study id
export const QUESTION_BY_ID_URL= QUESTIONS_URL + '/case_study/';


//url for posting user scores to the database 
export const USER_SCORES_URL = BASE_URL + '/api/userscores/';