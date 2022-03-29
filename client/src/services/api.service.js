import axios from 'axios';
import { BaseService } from './base.service';

const baseUrl = 'http://localhost:8081/';

class ApiService extends BaseService {
    constructor() {
        super();
        this.name = localStorage.getItem('name');
        this.email = localStorage.getItem('email');
        this.outlookId = localStorage.getItem('outlookId');
        console.log(this.name, this.email, this.outlookId);
        this.api = axios.create({
            baseURL: 'http://localhost:8081/',
            headers: { 'authorization': 'Basic ' + btoa(`${this.email}:${this.outlookId}`) }
        });
    }

    async createUser() {
        try {
            const user = await this.api.post(baseUrl + 'users', {
                name: this.name,
                email: this.email,
                outlookId: this.outlookId,

            });
            if (user.status !== 201) {
                return null;
            }
            return user.data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async getUser() {
        try {
            const user = await this.api.get(baseUrl + 'users');
            if (user.status === 404) {
                throw new Error();
            }
            if (user.status !== 202) {
                return null;
            }
            return user.data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async createTickets(title, description, emails, url) {
        try {
            const ticket = await this.api.post(baseUrl + 'tickets', {
                title: title,
                description: description,
                targetEmails: emails,
                pictureUrl: url,
            });
            if (ticket.status !== 201) {
                return null;
            }
            return ticket.data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async createComment(id, content, url) {
        try {
            const comment = await this.api.post(baseUrl + 'tickets/' + id + '/comment', {
                content: content,
                pictureUrl: url,
            });
            if (comment.status !== 201) {
                return null;
            }
            return comment.data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async closeTicket(id) {
        try {
            const ticket = await this.api.patch(baseUrl + 'tickets/' + id + '/close');
            if (ticket.status !== 202) {
                return null;
            }
            return ticket.data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async getTickets() {
        try {
            const ticket = await this.api.get(baseUrl + 'tickets');
            if (ticket.status !== 202)
                return null
            return ticket.data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async getCommentsById(ticketId) {
        try {
            const comments = await this.api.get(baseUrl + 'comments/' + ticketId);
            if (comments.status !== 202)
                return null;
            return comments.data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await this.api.get(baseUrl + 'tickets/' + ticketId);
            if (ticket.status !== 202)
                return null;
            return ticket.data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }


}

export default ApiService;