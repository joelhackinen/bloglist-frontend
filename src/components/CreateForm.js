import { useState } from 'react' 


const CreateForm = ({createBlog}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  
  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleCreate}>
        <div>
          title:
            <input
            type="text"
            name="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
            <input
            type="text"
            name="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
            type="text"
            name="Url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateForm