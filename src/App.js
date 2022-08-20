import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_TODOS = gql`
query getTodos{
  todos{
    done
    id 
    text
  }
}
`;

const TOGGLE_TODO = gql`
 mutation toggleTodo($id: uuid!, $done: Boolean!){
  update_todos(where: {id: {_eq: $id}}, _set:{done: $done} ){
    returning{
      done
      id
      text
    }
  }
 }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!){
    insert_todos(objects: {text: $text}){
      returning{
        done
        id
        text
      }
    }
  }
`;

const DELETE_TODO = gql`
mutation deleteTodo($id: uuid! ) {
  delete_todos(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      text
    }
  }
}
`;



function App() {
  const [todoText, setTodoText] = React.useState('');
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText("") ///After completed query. Clear input
  })

  const [deleteTodo] = useMutation(DELETE_TODO);

  async function handleToggleTodo({ id, done }) {
    const data = await toggleTodo({ variables: { id, done: !done } })
    console.log('toggle todo', data);
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    if (!todoText.trim()) return; ///If not empty
    const data = await addTodo({
      variables: { text: todoText }, //field 'text' it's field inside graphql.
      refetchQueries: [
        { query: GET_TODOS } ////Fetch query. Send query to db and get to page without reload.
      ]
    });
    console.log('add todo', data);
    // setTodoText(''); /// clear text after add todo
  }


  async function handleDeleteTodo({ id }) {
    const isConfirmed = window.confirm("Do you want to delete this?")
    if (isConfirmed) {
      const data = await deleteTodo({
        variables: { id },  //Referring to current id, what I want to delete.
        update: cache => {
          const prevData = cache.readQuery({ query: GET_TODOS }) // Get all cache data before mutation delete
          const newTodos = prevData.todos.filter(todo => todo.id !== id); // every todo which id not equal what I deleted.
          cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } }); //write query, after delete from cache
        }
      })
      console.log('deleted todo', data);
    }
  }

  if (loading) return <div>Loading... </div>
  if (error) return <div>Error fetching data</div>
  return (<div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1" >
    <h1 className='f2-1'>React Checklist</h1>
    <form
      onSubmit={handleAddTodo}
      className='mb3'>
      <input
        className='pa2 f4 b--dashed'
        type="text"
        placeholder="write your todo"
        onChange={event => setTodoText(event.target.value)}
        value={todoText}
      />
      <button
        className='pa2 f4 bg-green'
        type="submit">Create</button>
    </form>
    <div className='flex items-center justify-center flex-column'>
      {data.todos.map(todo => (
        ///onDoubleClick cross text
        <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
          <span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>
            {todo.text}
          </span>
          <button
            onClick={() => handleDeleteTodo(todo)}
            className='bg-transparent bn f4'>
            <span className='red'>&times;</span>
          </button>
        </p>
      ))}
    </div>

  </div>)
}

export default App;
