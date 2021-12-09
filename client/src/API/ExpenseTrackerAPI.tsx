import {apiEndpoint} from '../config'
import Axios from 'axios'
import {UpdateExpenseRequest} from "../Types/UpdateExpenseRequest";
import {CreateExpenseRequest} from "../Types/CreateExpenseRequest";
import {Expense} from "../Types/Expense";

export async function getExpenses(idToken: string): Promise<Expense[]> {
    const response = await Axios.get(`${apiEndpoint}/expenses`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })
    return response.data.items
}

export async function createExpense(
    idToken: string,
    newExpense: CreateExpenseRequest
): Promise<Expense> {
    const response = await Axios.post(`${apiEndpoint}/expenses`, JSON.stringify(newExpense), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.item
}

export async function patchExpense(
    idToken: string,
    expenseId: string,
    updatedExpense: UpdateExpenseRequest
): Promise<void> {
    await Axios.patch(`${apiEndpoint}/expenses/${expenseId}`, JSON.stringify(updatedExpense), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
}

export async function deleteExpense(
    idToken: string,
    expenseId: string
): Promise<void> {
    await Axios.delete(`${apiEndpoint}/expenses/${expenseId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
}

export async function getInvoiceUploadUrl(
    idToken: string,
    expenseId: string
): Promise<string> {
    const response = await Axios.post(`${apiEndpoint}/expenses/${expenseId}/invoice`, '', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
    await Axios.put(uploadUrl, file)
}
