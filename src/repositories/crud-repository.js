const { Logger } = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');


class CrudRepository{

    constructor(model){
        this.model=model;
    }

    //for creating a model  
    async create(data){
            const response = await this.model.create(data);
            return response; 
    }

    //For deleting a model 
    async delete(data){
            const response = await this.model.destroy({
                where: {
                    id: data
                }
            }
            );
            if(!response){
                throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND );
            }
            return response; 
    }

    //for selecting a single unique query
    async get(data){
            const response = await this.model.findByPk(data);
            if(!response){
                throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND );
            }
            return response; 
    }

    //for selecting a list of records
    async getAll(){
            const response = await this.model.findAll();
            return response; 
    }

    //for updating a set of records in our database
    async update(id, data){
            const response = await this.model.update(data , {
                where : {
                    id : id
                }
            });
            console.log('response in update',response);
            if(response[ 0 ] == 0 ){
                console.log('in crud repo');
                throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
            }
            return response;
    }

    

}

module.exports = CrudRepository;