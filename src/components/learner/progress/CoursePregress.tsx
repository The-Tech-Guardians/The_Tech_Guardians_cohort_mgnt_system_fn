

const CouserPregress = () => {

  const courses = [
    { name: 'Full-Stack Web Development', progress: 35, lessons: '17/48', score: 85, status: 'In Progress' },
    { name: 'JavaScript Fundamentals', progress: 100, lessons: '32/32', score: 92, status: 'Completed' },
    { name: 'React Advanced', progress: 60, lessons: '15/25', score: 88, status: 'In Progress' },
  ];

  return (
    <div>
       <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h2>
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{course.lessons} lessons</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'Completed' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">{course.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">Average Score</span>
                    <span className="text-xs font-semibold text-gray-900">{course.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </div>
  )
}

export default CouserPregress