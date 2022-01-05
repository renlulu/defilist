import { Button, GU, SidePanel, Info } from '@aragon/ui'
import React, { useCallback } from 'react'
import { Formik, Field } from 'formik'
import * as yup from 'yup'
import TextField from './TextField'
import { toBasisPoints, sum } from '../utils'
import BN from 'bn.js'

const TREASURY = 'treasury'
const INSURANCE = 'insurance'
const OPERATORS = 'operators'

const initialValues = {
  [TREASURY]: 0,
  [INSURANCE]: 0,
  [OPERATORS]: 0,
}

const getFieldSchema = (fieldName) => {
  return yup
    .number()
    .positive()
    .required()
    .min(0)
    .max(100)
    .test(
      fieldName,
      `${fieldName} must be an integer or have 1 or 2 decimal places.`,
      (value) => {
        const regex = /^\d{1,3}(\.\d{1,2})?$/
        return regex.test(value)
      }
    )
}

const validationSchema = yup
  .object()
  .shape({
    [TREASURY]: getFieldSchema(TREASURY),
    [INSURANCE]: getFieldSchema(INSURANCE),
    [OPERATORS]: getFieldSchema(OPERATORS),
  })
  .test({
    name: 'total',
    test: function ({ operators, insurance, treasury }) {
      const operatorsBps = toBasisPoints(operators)
      const insuranceBps = toBasisPoints(insurance)
      const treasuryBps = toBasisPoints(treasury)

      const total = sum(operatorsBps, insuranceBps, treasuryBps)
      const totalEquals10000 = new BN(total).eq(new BN(10000))

      if (totalEquals10000) return true

      return this.createError({
        path: 'total',
        message: 'All fields must add up to 100%',
      })
    },
  })

function PanelContent({ api, onClose }) {
  const onSubmit = useCallback(
    ({ treasury, insurance, operators }) => {
      const insuranceBps = toBasisPoints(insurance)
      const treasuryBps = toBasisPoints(treasury)
      const operatorsBps = toBasisPoints(operators)

      api(treasuryBps, insuranceBps, operatorsBps)
        .catch(console.error)
        .finally(() => {
          onClose()
        })
    },
    [api, onClose]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ submitForm, errors, isSubmitting }) => {
        const handleSubmit = (e) => {
          e.preventDefault()
          submitForm()
        }
        return (
          <form
            css={`
              margin-top: ${3 * GU}px;
            `}
            onSubmit={handleSubmit}
          >
            <Info
              title="Action"
              css={`
                margin-bottom: ${3 * GU}px;
              `}
            >
              This action will change the fee distribution between treasury,
              insurance fund, and Node Operators. All fields must add up to
              100%.
            </Info>
            <Field
              name={TREASURY}
              type="number"
              label="Treasury fee (%)"
              component={TextField}
            />
            <Field
              name={INSURANCE}
              type="number"
              label="Insurance fee (%)"
              component={TextField}
            />
            <Field
              name={OPERATORS}
              type="number"
              label="Operators fee (%)"
              component={TextField}
            />
            {errors.total && (
              <Info
                mode="error"
                css={`
                  margin-bottom: ${3 * GU}px;
                `}
              >
                {errors.total}
              </Info>
            )}
            <Button
              mode="strong"
              wide
              required
              disabled={isSubmitting}
              label="Submit"
              type="submit"
            />
          </form>
        )
      }}
    </Formik>
  )
}

export default (props) => (
  <SidePanel title="Change fee distribution" {...props}>
    <PanelContent {...props} />
  </SidePanel>
)
