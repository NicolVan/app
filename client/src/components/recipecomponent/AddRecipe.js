import React from 'react';
import axios from 'axios';
import trash from '../image/trash.png';
import { API_URL } from '../constants';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

const AddRecipe = () => {
  const categories = ['Soup', 'Dessert', 'Lunch', 'Dinner', 'Meal', 'Vegan', 'Pasta', 'Salad', 'Cake', 'Breakfast'];;

  const validationSchema = Yup.object({
    name: Yup.string().required('Please enter a name recipe'),
    category: Yup.array().of(Yup.string().oneOf(categories, 'Invalid category')).min(1, 'Select at least one category').required('Please select the category'),
    instructions: Yup.string().required('Please enter a instructions'),
    prepTime: Yup.number().required('Please enter a number of prepare time in minute').min(0, 'Invalid preparation time'),
    cookTime: Yup.number().required('Please enter a number of cook time time in minute').min(0, 'Invalid cooking time'),
    servings: Yup.number().required('Please enter a number of serving').min(1, 'Invalid number of servings'),
    author: Yup.string().required('Please enter a name auhtor recipe if not please write none'),
    imageUrl: Yup.string().url('Invalid URL').required('Please enter a URL of image'),
    ingredients: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Please enter a name ingredients'),
        quantity: Yup.string().required('Please enter a quantity ingredient'),
      })
    ).min(1, 'At least one ingredient is required'),
  });

  const addRecipe = (values, { setSubmitting, resetForm }) => {
    axios.post(`${API_URL}/recipes/addrecipes`, values)
      .then(response => {
        console.log('Recipe added successfully:', response.data);
        alert('Recipe added successfully');
        resetForm();
      })
      .catch(error => {
        console.error('Error adding recipe:', error);
        alert('Failed to add recipe');
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Formik
      initialValues={{
        name: '',
        category: [],
        instructions: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        author: '',
        imageUrl: '',
        ingredients: [{ name: '', quantity: '' }],
      }}
      validationSchema={validationSchema}
      onSubmit={addRecipe}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
            <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
                <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
                  <h2 className='text-2xl text-center'>Add Recipe</h2>
                  <div>
                    <Field
                      type='text'
                      name='name'
                      placeholder='Recipe Name'
                      className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                    />
                    <ErrorMessage name='name' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                      as='select'
                      name='category'
                      multiple
                      className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                    >
                    {categories.map(category => (
                        <option key={category} value={category} label={category} />
                      ))}
                    </Field>
                    <ErrorMessage name='category' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                      type='text'
                      name='instructions'
                      placeholder='Instructions'
                      className='w-full h-36 justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                    />
                    <ErrorMessage name='instructions' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                      type='number'
                      name='prepTime'
                      placeholder='Prep Time (minutes)'
                      className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                    />
                    <ErrorMessage name='prepTime' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                      type='number'
                      name='cookTime'
                      placeholder="Cook Time (minutes)"
                      className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                    />
                    <ErrorMessage name='cookTime' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                     type='number'
                      name='servings'
                     placeholder='Servings'
                     className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                    />
                   <ErrorMessage name='servings' component='div' className='text-red-500' />
                  </div>
                  <div>
                   <Field
                      type='text'
                      name='author'
                     placeholder='Author'
                     className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                    />
                    <ErrorMessage name='author' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                     type='text'
                     name='imageUrl'
                     placeholder='Image URL'
                     className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                    />
                   <ErrorMessage name='imageUrl' component='div' className='text-red-500' />
                  </div>
                  <FieldArray name='ingredients'>
                   {({ remove, push }) => (
                     <div>
                        {values.ingredients.map((ingredient, index) => (
                          <div key={index} className='flex items-center space-x-4'>
                            <Field
                             name={`ingredients.${index}.name`}
                             placeholder='Ingredient Name'
                             className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                           />
                            <Field
                              name={`ingredients.${index}.quantity`}
                             placeholder='Quantity'
                             className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                           />
                           <button
                            type='button'
                            onClick={() => push({ name: '', quantity: '' })}
                            className='w-16 h-10 text-center mb-2 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:ring-4 focus:ring-gray-100'
                            >+
                          </button>
                          <button
                             type='button'
                             onClick={() => remove(index)}
                             className='w-16 h-10 text-center mb-2 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:ring-4 focus:ring-gray-100'
                           >
                             <img src={trash} alt='Remove' className='w-5 h-5'/>
                           </button>
                           <div className='flex'> 
                           <ErrorMessage name={`ingredients.${index}.name`} component='div' className='text-red-500' />
                           <ErrorMessage name={`ingredients.${index}.quantity`} component='div' className='text-red-500' />
                            </div>
                         </div>
                        ))}
                        <div className='grid justify-items-center '>
                          <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-40 h-10 text-center text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:ring-4 focus:ring-gray-100'
                            > 
                            {isSubmitting ? 'Adding...' : 'Add Recipe'}
                          </button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                  </div>
                </div>
                </div>
            </Form>
          )}
    </Formik>
  );
};

export default AddRecipe;