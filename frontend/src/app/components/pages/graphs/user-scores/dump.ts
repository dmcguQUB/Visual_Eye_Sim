
  getTotalScore(testId: string): void {
    this.testService.calculateScore(testId).subscribe(
      (result: Test) => {
        // Assuming that the returned Test object contains a property 'totalScore'
        this.totalScore = result.diagnosisTest?.score + result.eyeTest?.score + result.investigationsTest?.score;      },
      error => {
        console.error('Error calculating score:', error);
      }
    );}

    // Shows details for a selected test
showDetails(test: Test): void {
  this.selectedUserTest = test;
  this.showDetailsSection = true;
}

// Gets the percentage score for a test
getPercentage(test: Test): number {
  if (!test) return 0;
  const totalQuestions = test.questions.length;
  const correctQuestions = this.getTotalScore(test);
  return (correctQuestions / totalQuestions) * 100;
}

 // Helper method to find the user answer for a specific question
 getAnswerForQuestion(questionId: string): UserAnswer | undefined {
  if (!this.selectedUserTest || !this.selectedUserScore.answers) {
    return undefined;
  }

  return this.selectedUserScore.answers.find(
    (answer) => answer.questionId === questionId
  );
}