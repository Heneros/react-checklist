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

function App() {
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);

  async function handleToggleTodo({ id, done }) {
   const data = await toggleTodo({ variables: { id, done: !done } })
   console.log(data);
  }

  if (loading) return <div>Loading... </div>
  if (error) return <div>Error fetching data</div>
  return (<div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1" >
    <h1 className='f2-1'>React Checklist</h1>
    <form className='mb3'>
      <input
        className='pa2 f4 b--dashed'
        type="text"
        placeholder="write your todo"
      />
      <button
        className='pa2 f4 bg-green'
        type="submit">Create</button>
    </form>
    <div className='flex items-center justify-center flex-column'>
      {data.todos.map(todo => (
        <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
          <span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>
            {todo.text}
          </span>
          <button className='bg-transparent bn f4'>
            <span className='red'>&times;</span>
          </button>
        </p>
      ))}
    </div>

  </div>)
}

export default App;
