import {History} from 'history'
import * as React from 'react'
import {Button, Divider, Form, Grid, Header, Input, Label, Loader} from 'semantic-ui-react'

import {createExpense, deleteExpense, getExpenses} from '../API/ExpenseTrackerAPI'
import Auth from '../Auth/Auth'
import {Expense} from "../Types/Expense";
import {Categories} from "../Types/ExpenseCategories";
import {ExpenseListItemFragment} from "./ExpenseListItemFragment";

interface ExpensesProps {
    auth: Auth
    history: History
}

interface ExpensesState {
    expenses: Expense[]
    newExpenseDescription: string
    newExpenseCategory: string
    newExpenseAmount: number
    loadingExpenses: boolean
}


export class ExpensesList extends React.PureComponent<ExpensesProps, ExpensesState> {
    constructor(props: ExpensesProps) {
        super(props);
        this.state = {
            expenses: [],
            newExpenseDescription: '',
            newExpenseCategory: '',
            newExpenseAmount: 0,
            loadingExpenses: true
        };
        this.onUpdateClicked = this.onUpdateClicked.bind(this);
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

    onUploadClick = (expenseId: string) => {
        this.props.history.push(`/expenses/${expenseId}/upload`)
    }

    onUpdateClicked(expenseId: string) {
        this.props.history.push(`/expenses/${expenseId}/edit`)
    }

    onExpenseCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({loadingExpenses: true})
        if (this.state.expenses === undefined) {
            this.setState(
                {expenses: []}
            )
        }
        try {
            const newExpense = await createExpense(this.props.auth.getIdToken(), {
                description: this.state.newExpenseDescription,
                category: this.state.newExpenseCategory,
                amount: this.state.newExpenseAmount
            })
            this.setState({
                expenses: [...this.state.expenses, newExpense],
                newExpenseDescription: '',
                newExpenseCategory: '',
                newExpenseAmount: 0,
                loadingExpenses: false
            })
        } catch (e) {
            alert('Expense creation failed')
        }
    }

    async componentDidMount() {
        try {
            const expenses = await getExpenses(this.props.auth.getIdToken())
            this.setState({
                expenses,
                loadingExpenses: false
            })
        } catch (e: any) {
            console.log(e)
            alert(`Failed to fetch expenses: ${e.message}`)
            this.setState({
                loadingExpenses: false
            })
        }
    }

    render() {
        return (
            <div>
                <Header as='h1'>Expenses</Header>

                {this.renderCreateExpenseInput()}

                {this.renderExpenses()}
            </div>
        )
    }

    renderCreateExpenseInput() {
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
                        <Button color={'green'} content='Add Expense' icon='right arrow' labelPosition='right'
                                onClick={this.onExpenseCreate}/>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        )
    }

    renderExpenses() {
        if (this.state.loadingExpenses) {
            return this.renderLoading()
        }
        if (!this.state.expenses || this.state.expenses.length === 0) {
            return (
                <div>
                    <Divider/>
                    <h3>No Expenses Found</h3>
                </div>
            )
        }
        return this.renderExpensesList()
    }

    renderLoading() {
        return (
            <Grid.Row>
                <Loader indeterminate active inline='centered'>
                    Loading Expenses
                </Loader>
            </Grid.Row>
        )
    }


    renderExpensesList() {
        return (
            <ExpenseListItemFragment expenses={this.state.expenses}
                                     auth={this.props.auth}
                                     onUpdateClicked={this.onUpdateClicked}
                                     onUploadClick={this.onUploadClick}/>
        )
    }
}
