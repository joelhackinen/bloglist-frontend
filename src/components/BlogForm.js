import { useState } from 'react'


const BlogForm = ({ createBlog }) => {
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
    <div className="formDiv">
      <h3>create new</h3>
      <form onSubmit={handleCreate}>
        <div>
          <input
            type="text"
            id="title-input"
            value={title}
            placeholder='title here'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            id="author-input"
            value={author}
            placeholder='author here'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            id="url-input"
            value={url}
            placeholder='url here'
            onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button id="create-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm