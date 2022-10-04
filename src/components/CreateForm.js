const CreateForm = ({handleCreate, setTitle, setAuthor, setUrl}) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
            <input
            type="text"
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
            <input
            type="text"
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
            type="text"
            name="Url"
            onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateForm