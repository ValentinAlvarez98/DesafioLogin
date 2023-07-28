import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({

      first_name: {
            type: String,
            required: true,
      },

      last_name: {
            type: String,
            required: true,
      },

      email: {
            type: String,
            required: true,
      },

      password: {
            type: String,
            required: true,
      },

      role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
      },

      phone: {
            type: String,
      },

});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;