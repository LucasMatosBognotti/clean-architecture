export interface CheckSurveyById {
  checkById: (accountId: string) => Promise<CheckSurveyById.Result>
}

export namespace CheckSurveyById {
  export type Result = boolean
}
