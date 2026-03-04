import { useEffect, useState } from "react"
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi"

interface Post {
  _id: string;
  title: string;
  userId?: { name: string };
  category?: { name: string };
  status: string;
  createdAt: string;
}

const PostsManagement = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError("")
      // Mock data - replace with actual API call when available
      setPosts([])
    } catch {
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setActionLoading(id)
        // Mock delete - replace with actual API call when available
        setPosts(posts.filter(post => post._id !== id))
      } catch {
        setError("Failed to delete post")
      } finally {
        setActionLoading(null)
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Manage Posts</h1>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>View and manage all platform posts</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total: <span style={{ fontWeight: 'bold' }}>{posts.length}</span></p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', padding: '12px 16px', borderRadius: '8px', color: '#991b1b', marginBottom: '16px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'white', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280' }}>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'white', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280' }}>No posts found</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Title</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Author</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Category</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Date</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <tr key={post._id} style={{ borderBottom: idx < posts.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontWeight: '500', fontSize: '14px', margin: 0 }}>{post.title || "N/A"}</p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{post.userId?.name || "Unknown"}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 12px', backgroundColor: '#e9d5ff', color: '#6b21a8', fontSize: '12px', borderRadius: '9999px' }}>
                      {post.category?.name || "N/A"}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 12px', backgroundColor: post.status === 'approved' ? '#dcfce7' : '#f3f4f6', color: post.status === 'approved' ? '#15803d' : '#374151', fontSize: '12px', borderRadius: '9999px' }}>
                      {post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1) : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#dbeafe', color: '#1e40af', border: 'none', cursor: 'pointer' }} title="View">
                        <FiEye size={16} />
                      </button>
                      <button style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fed7aa', color: '#92400e', border: 'none', cursor: 'pointer' }} title="Edit">
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={actionLoading === post._id}
                        style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer', opacity: actionLoading === post._id ? 0.6 : 1 }}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PostsManagement
