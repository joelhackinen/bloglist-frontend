import Togglable from './Togglable'

const Blog = ({blog, addLike, deleteBlog, userId}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    borderRadius: 4,
    marginBottom: 5
  }

  const handleLike = (event) => {
    event.preventDefault()
    const newBlog = {
      id: blog.id,
      likes: blog.likes+1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    addLike(newBlog)
  }

  const handleDelete = (event) => {
    event.preventDefault()
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle}>
      {blog.title} by {blog.author}
      <Togglable showText='view' hideText='hide'>
        url: {blog.url}<br/>
        likes: {blog.likes}<button onClick={handleLike}>like</button><br/>
        adder: {blog.user.username}<br/>
        {userId === blog.user.id ? <button onClick={handleDelete}>remove</button>:null}<br/>
      </Togglable>
    </div>  
  )
}

export default Blog