import { useState } from 'react'


const Blog = ({ blog, addLike, deleteBlog }) => {
    const [blogInformationVisible, setBlogInformationVisible] = useState(false)

    const hideWhenVisible = {
        display: blogInformationVisible ? 'none' : '',
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }
    const showWhenVisible = {
        display: blogInformationVisible ? '' : 'none',
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div>
            <div style={hideWhenVisible} className="blog-container">
                {blog.title} {blog.author}
                <button onClick={() => setBlogInformationVisible(true)}>view</button>
            </div>

            <div style={showWhenVisible} className="blog">
                {blog.title} {blog.author}
                <button onClick={() => setBlogInformationVisible(false)}>hide</button>
                <br/>
                {blog.url}<br/>
                <span className="like-count">
                    {blog.likes}
                </span>
                <button onClick={() => addLike(blog)}>like</button>
                <br/>
                {blog.user.name}<br/>
                <button onClick={() => deleteBlog(blog)}>remove</button>
            </div>
        </div>

    )
}


export default Blog