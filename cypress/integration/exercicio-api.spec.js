/// <reference types="cypress" />
import { fake } from 'faker';
import contrato from '../contracts/usuarios.contract'
var faker = require('faker');
faker.locale = 'pt_BR';

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
         cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });
 
    it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
    });

    it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {          
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
          let nomeFaker = faker.name.firstName()+" "+faker.name.lastName()
          let emailFaker = faker.internet.email()
          let senhaFaker = faker.internet.password()
          let adminFaker = faker.datatype.boolean()
          
          cy.cadastrarUsuario(nomeFaker, emailFaker, senhaFaker, `${adminFaker}`)
               .then((response) => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               })   
          
    });

    it('Deve validar um usuário com email inválido', () => {
          let nomeFaker = faker.name.firstName()+" "+faker.name.lastName()
          let senhaFaker = faker.internet.password()
          let adminFaker = faker.datatype.boolean()

          cy.cadastrarUsuario(nomeFaker, "fulano#qa.com", senhaFaker, `${adminFaker}`)
          .then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser um email válido')
          })   
    });

    it('Deve editar um usuário previamente cadastrado', () => {
          let nomeFaker = faker.name.firstName()+" "+faker.name.lastName()
          let emailFaker = faker.internet.email()     
          let senhaFaker = faker.internet.password()
          let adminFaker = faker.datatype.boolean()
          
          cy.cadastrarUsuario(nomeFaker, emailFaker, senhaFaker, `${adminFaker}`)
               .then(response => {
                    let id = response.body._id
               
                    cy.request({
                         method: "PUT",
                         url: `usuarios/${id}`,
                         body:
                         {
                              "nome": nomeFaker,
                              "email": emailFaker,
                              "password": senhaFaker,
                              "administrador": `${adminFaker}`
                         }
                    }).then((response) => {
                         expect(response.status).to.equal(200)
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
          
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
          let nomeFaker = faker.name.firstName()+" "+faker.name.lastName()
          let emailFaker = faker.internet.email()     
          let senhaFaker = faker.internet.password()
          let adminFaker = faker.datatype.boolean()
          
          cy.cadastrarUsuario(nomeFaker, emailFaker, senhaFaker, `${adminFaker}`)
               .then(response => {
                    let id = response.body._id                    
                    cy.request({
                         method: "DELETE",
                         url: `usuarios/${id}`
                    }).then(response =>{
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                     })

               });
     });


})
