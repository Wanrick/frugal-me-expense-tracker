import * as React from 'react'
import {Button, Form, Grid, Input, Label} from 'semantic-ui-react'
import Auth from '../Auth/Auth'
import {patchExpense} from '../API/ExpenseTrackerAPI'
import {Categories} from "../Types/ExpenseCategories";

interface EditExpenseProps {
  match: {
    params: {
      expenseId: string
    }
  }
  auth: Auth
}

interface EditExpenseState {
  newExpenseCategory: string
  newExpenseAmount: number
  newExpenseDescription: string
}

export class ExpenseEdit extends React.PureComponent<
  EditExpenseProps,
  EditExpenseState
> {
  state: EditExpenseState = {
    newExpenseDescription: '',
    newExpenseCategory: '',
    newExpenseAmount: 0
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({newExpenseDescription: event.target.value})
  }

  handleCategoryChange = (event: React.SyntheticEvent<HTMLInputElement, Event>, value: string | undefined) => {
    if (value !== undefined) {
      this.setState({newExpenseCategory: value})
    }
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({newExpenseAmount: parseInt(event.target.value)})
  }

  onExpenseUpdate = async () => {
    try {
      await patchExpense(this.props.auth.getIdToken(), this.props.match.params.expenseId, {
        description: this.state.newExpenseDescription,
        category: this.state.newExpenseCategory,
        amount: this.state.newExpenseAmount
      })
      alert('Expense was updated')
    } catch {
      alert('Expense update failed')
    }
  }

  render() {
    return (
        <Grid.Row>
          <Grid.Column width={16}>
            <Form>
              <Form.Group widths='equal'>
                <Form.Input fluid label='Description' placeholder='Description'
                            onChange={this.handleDescriptionChange}/>
                <Form.Select
                    fluid
                    label='Category'
                    placeholder='Category'
                    options={Categories}
                    onChange={(e: any, {value}) => this.handleCategoryChange(e, value?.toString())}
                />
                <Form.Field>
                  <label>Enter Amount</label>
                  <Input labelPosition='right' type='number' placeholder='Amount'
                         onChange={this.handleAmountChange}>
                    <Label basic>€</Label>
                    <input/>
                    <Label>.00</Label>
                  </Input>
                </Form.Field>
              </Form.Group>
              <Button color={'green'} content='Update Expense' icon='right arrow' labelPosition='right'
                      onClick={this.onExpenseUpdate}/>
            </Form>
          </Grid.Column>
        </Grid.Row>
    )
  }
}
