

import AddEvaluationForm from '@/components/add-evaluation-form'
import Heading from '@/components/heading'
import React from 'react'

const EvaluationForm = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title="Create Evaluation Form"
          description="Create a new evaluation form by providing the necessary details, such as the title, description, and the start and end dates of the evaluation period. You can also add categories and criteria to customize the evaluation form based on your institution's requirements."
        />
      </div>
      <AddEvaluationForm />
    </div>
  )
}

export default EvaluationForm