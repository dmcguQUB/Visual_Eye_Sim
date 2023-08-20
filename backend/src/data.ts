//backend/src/data.ts
//export constant
export const sample_case_studies: any[] =[

  {
    //case study 1
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
  //case study 2
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
    //case study 3
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


//sample users to populate the database
export const sample_users: any[] = [
  {
    //user 1
    name: "John Doe",
    email: "john@gmail.com",
    password: "12345",
    address: "Toronto On",
    isAdmin: true,
  },
  {
    //user 2
    name: "Jane Doe",
    email: "Jane@gmail.com",
    password: "12345",
    address: "Shanghai",
    isAdmin: false,
  },
];

//samle questions to populate database
export const sample_questions: any[] = [
  {
    //EYE TESTS
    //case study 1
    questionText: "Case Study 1 - Eye Tests - Question 1",
    options: [
      { text: "Option 1", correct: true },
      { text: "Option 2", correct: false },
      { text: "Option 3", correct: false },
      { text: "Option 4", correct: false },
    ],
    explanation: "Explanation for Case Study 1 - Eye Tests  - Question 1",
    caseStudyId: "64c23a6d1a8f96f293896214",
    questionType: "eye-test"

  },
  {
    questionText: "Case Study 1 - Eye Tests - Question 2",
    options: [
      { text: "Option 1", correct: false },
      { text: "Option 2", correct: true },
      { text: "Option 3", correct: false },
      { text: "Option 4", correct: false },
    ],
    explanation: "Explanation for Case Study 1 - Eye Tests  - Question 2",
    caseStudyId: "64c23a6d1a8f96f293896214",
    questionType: "eye-test"
  },

  //case study 2
  {
    questionText: "Case Study 2 - Eye Tests - Question 1",
    options: [
      { text: "Option 1", correct: false },
      { text: "Option 2", correct: false },
      { text: "Option 3", correct: true },
      { text: "Option 4", correct: false },
    ],
    explanation: "Explanation for Case Study 2 - Eye Tests  - Question 1",
    caseStudyId: "64c23a6d1a8f96f293896215",
    questionType: "eye-test"
  },
  {
    questionText: "Case Study 2 - Eye Tests - Question 2",
    options: [
      { text: "Option 1", correct: false },
      { text: "Option 2", correct: false },
      { text: "Option 3", correct: false },
      { text: "Option 4", correct: true },
    ],
    explanation: "Explanation for Case Study 2 - Eye Tests  - Question 2",
    caseStudyId: "64c23a6d1a8f96f293896215",
    questionType: "eye-test"
  },
  {
    //Investigations
    //case study 1
    questionText: "Case Study 1 - Investigation - Question 1, Choose which investigations you want to request:",
    options: [
      { text: "Erythrocyte sedimentation rate", correct: true },
      { text: "C-reactive protein", correct: true },
      { text: "Full blood picture", correct: true },
      { text: "Urea and electrolytes", correct: true },
      { text: "Liver function test", correct: true },
      { text: "Blood glucose", correct: true },
      { text: "Blood pressure", correct: false },
      { text: "Temporal artery biopsy", correct: true },
      { text: "CT head", correct: true },
      { text: "Fundal photograph", correct: true },
      { text: "Flourescein angiography", correct: false },
      { text: "Optical coherence tomography", correct: true },
      { text: "Formal visual fields", correct: true },
    ],
    explanation: "Explanation for Case Study 1 - Eye Tests  - Question 1",
    caseStudyId: "64c23a6d1a8f96f293896214",
    questionType: "investigation"

  },{
   //case study 2
   questionText: "Case Study 2 - Investigation - Question 1, Choose which investigations you want to request:",
   options: [
     { text: "Erythrocyte sedimentation rate", correct: true },
     { text: "C-reactive protein", correct: true },
     { text: "Full blood picture", correct: true },
     { text: "Urea and electrolytes", correct: true },
     { text: "Liver function test", correct: true },
     { text: "Blood glucose", correct: true },
     { text: "Blood pressure", correct: false },
     { text: "Temporal artery biopsy", correct: true },
     { text: "CT head", correct: true },
     { text: "Fundal photograph", correct: true },
     { text: "Flourescein angiography", correct: false },
     { text: "Optical coherence tomography", correct: true },
     { text: "Formal visual fields", correct: true },
   ],
   explanation: "Explanation for Case Study 2 - Eye Tests  - Question 1",
   caseStudyId: "64c23a6d1a8f96f293896215",
   questionType: "investigation"

 },
  
];


//sample user scores data to populate the database
export const sample_user_scores: any[] = [
  {
    userId: "64b83c2db2ec5e03be43b139", // assuming John Doe's ID is 1
    caseStudyId: "64b55374f856931e2ae20b20",
    score: 8,
    answers: [
      { questionId: "64b947a5f704861cb51260ae", userAnswer: "Option 1", correct: true },
      { questionId: "64b947a5f704861cb51260b3", userAnswer: "Option 2", correct: false },
    ],
    testTakenAt: new Date(),
  },
];

// Sample data for Test model

export const sample_test_data: any[] = [
  {
    userId: "64b83c2db2ec5e03be43b139", // John Doe's ID
    caseStudyId: "64c23a6d1a8f96f293896214", // Referring to the first case study

    // Eye Test Answers
    eyeTest: {
      answers: [
        { questionId: "64db6bb927c64bd3631623c1", answer: "Option 1", correct: true },
        { questionId: "64db6bb927c64bd3631623c6", answer: "Option 2", correct: true }
      ],
      score: 20 // 1 out of 2 questions correct
    },

    // Investigations Test Answers
    investigationsTest: {
      answers: [
        {
          questionId: "64db6bb927c64bd3631623d5",
          userAnswers: ["Erythrocyte sedimentation rate", "C-reactive protein"],
          correctAnswers: ["Erythrocyte sedimentation rate", "C-reactive protein", "Full blood picture"]
        },
      ],
      score: 2 // 2 out of 2 questions correct (assuming the userAnswers match correctAnswers)
    },

    // Diagnosis Test Answers
    diagnosisTest: {
      answers: [
        { questionId: "64e0cb2d0330651cec0a0ede", answer: "Option 1", correct: true },
      ],
      score: 10 // 1 out of 2 questions correct
    },

    createdAt: new Date(),
  },
  {
    userId: "64b91df69a8d3cea051c8fb6", // John Doe's ID
    caseStudyId: "64c23a6d1a8f96f293896214", // Referring to the first case study

    // Eye Test Answers
    eyeTest: {
      answers: [
        { questionId: "64db6bb927c64bd3631623c1", answer: "Option 2", correct: false },
        { questionId: "64db6bb927c64bd3631623c6", answer: "Option 2", correct: true }
      ],
      score: 10 // 1 out of 2 questions correct
    },

    // Investigations Test Answers
    investigationsTest: {
      answers: [
        {
          questionId: "64db6bb927c64bd3631623d5",
          userAnswers: ["Erythrocyte sedimentation rate", "C-reactive protein","Full blood picture"],
          correctAnswers: ["Erythrocyte sedimentation rate", "C-reactive protein", "Full blood picture"]
        },
      ],
      score: 10 // 2 out of 2 questions correct (assuming the userAnswers match correctAnswers)
    },

    // Diagnosis Test Answers
    diagnosisTest: {
      answers: [
        { questionId: "64e0cb2d0330651cec0a0ede", answer: "Option 2", correct: false },
      ],
      score: 10 // 1 out of 2 questions correct
    },

    createdAt: new Date(),
  }
];



