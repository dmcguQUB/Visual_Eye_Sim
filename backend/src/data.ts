//backend/src/data.ts
//export constant
export const sample_case_studies: any[] =[

  {
    caseStudyNumber:1,
    name: 'Lizzy Bard',
    imageUrl: 'assets/patient-1.jpg',
    age: '70',
    gender: 'female',
    medicalHistory: 'Hypertension',
    drugInfo: 'Aspirin, Irbesartan, Artificial Tears, No drug allergies',
    socialInfo: 'Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.',
    familyHistory: 'Mother had cateracts. Father had lazy eye.'
  },
  {
    caseStudyNumber:2,
    name: 'Beth Tate',
    imageUrl: 'assets/patient-2.jpg',
    age: '70',
    gender: 'female',
    medicalHistory: 'Hypertension',
    drugInfo: 'Aspirin, Irbesartan, Artificial Tears, No drug allergies',
    socialInfo: 'Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.',
    familyHistory: 'Mother had cateracts. Father had lazy eye.'
  },
  {
    caseStudyNumber:3,
    name: 'Frank Howard',
    imageUrl: 'assets/patient-3.jpg',
    age: '70',
    gender: 'female',
    medicalHistory: 'Hypertension',
    drugInfo: 'Aspirin, Irbesartan, Artificial Tears, No drug allergies',
    socialInfo: 'Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.',
    familyHistory: 'Mother had cateracts. Father had lazy eye.'
  },
]


export const sample_users: any[] = [
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: "12345",
    address: "Toronto On",
    isAdmin: true,
  },
  {
    name: "Jane Doe",
    email: "Jane@gmail.com",
    password: "12345",
    address: "Shanghai",
    isAdmin: false,
  },
];

export const sample_questions: any[] = [
  {
    questionText: "Case Study 1 - Question 1",
    options: [
      { text: "Option 1", correct: true },
      { text: "Option 2", correct: false },
      { text: "Option 3", correct: false },
      { text: "Option 4", correct: false },
    ],
    explanation: "Explanation for Case Study 1 - Question 1",
    caseStudyId: "1",
  },
  {
    questionText: "Case Study 1 - Question 2",
    options: [
      { text: "Option 1", correct: false },
      { text: "Option 2", correct: true },
      { text: "Option 3", correct: false },
      { text: "Option 4", correct: false },
    ],
    explanation: "Explanation for Case Study 1 - Question 2",
    caseStudyId: "1",
  },
  // ... More questions for Case Study 1
  {
    questionText: "Case Study 2 - Question 1",
    options: [
      { text: "Option 1", correct: false },
      { text: "Option 2", correct: false },
      { text: "Option 3", correct: true },
      { text: "Option 4", correct: false },
    ],
    explanation: "Explanation for Case Study 2 - Question 1",
    caseStudyId: "2",
  },
  {
    questionText: "Case Study 2 - Question 2",
    options: [
      { text: "Option 1", correct: false },
      { text: "Option 2", correct: false },
      { text: "Option 3", correct: false },
      { text: "Option 4", correct: true },
    ],
    explanation: "Explanation for Case Study 2 - Question 2",
    caseStudyId: "2",
  },
  // ... More questions for Case Study 2
  // And so on for more case studies
];

// backend/src/data.ts

export const sample_user_scores: any[] = [
  {
    userId: "64b83c2db2ec5e03be43b139", // assuming John Doe's ID is 1
    caseStudyId: "64b55374f856931e2ae20b20",
    score: 8,
    answers: [
      { questionId: "64b947a5f704861cb51260ae", userAnswer: "Option 1", correct: true },
      { questionId: "64b947a5f704861cb51260b3", userAnswer: "Option 2", correct: false },
      // more answers...
    ],
    testTakenAt: new Date(),
  },
  // more user scores...
];
