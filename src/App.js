import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_TODOS = gql`
query getTodos{
  todos{
    done
    id 
    text
  }
}
`;

function App() {
  const { data, loading, error } = useQuery(GET_TODOS);

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
      <button type="submit">Create</button>
    </form>
    <div>
      {data.todos.map(todo => (
        <p key={todo.id}>
          <span>
            {todo.text}
          </span>
          <button>&times;</button>
        </p>
      ))}
    </div>

  </div>)
}

export default App;
