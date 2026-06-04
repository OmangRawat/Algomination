import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Code, Search, BarChart3, Users, ArrowRight, Play, BookOpen, Zap } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Search,
      title: 'Interactive Visualizations',
      description: 'Learn algorithms through step-by-step animated visualizations that make complex concepts easy to understand.',
    },
    {
      icon: Code,
      title: 'Multiple Algorithms',
      description: 'Explore sorting, searching, data structures, and pathfinding algorithms with detailed explanations.',
    },
    {
      icon: BarChart3,
      title: 'Performance Analysis',
      description: 'Compare algorithm performance with real-time execution time and memory usage metrics.',
    },
    {
      icon: Users,
      title: 'Community Projects',
      description: 'Submit your own algorithm implementations and learn from others in the community.',
    },
  ]

  const algorithms = [
    {
      name: 'Bubble Sort',
      type: 'Sorting',
      difficulty: 'Beginner',
      description: 'Simple comparison-based sorting algorithm',
    },
    {
      name: 'Binary Search',
      type: 'Searching',
      difficulty: 'Beginner',
      description: 'Efficient search algorithm for sorted arrays',
    },
    {
      name: 'Quick Sort',
      type: 'Sorting',
      difficulty: 'Intermediate',
      description: 'Divide-and-conquer sorting algorithm',
    },
    {
      name: 'Dijkstra',
      type: 'Pathfinding',
      difficulty: 'Advanced',
      description: 'Shortest path algorithm for weighted graphs',
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Master Algorithms with
              <span className="block text-primary-200">Interactive Visualizations</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto"
            >
              Learn complex algorithms and data structures through step-by-step animated tutorials. 
              Perfect for students, developers, and anyone interested in computer science.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/algorithms"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Algomination?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform makes learning algorithms engaging and effective through modern technology and intuitive design.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Popular Algorithms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Algorithms
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with these fundamental algorithms and build your understanding step by step.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {algorithms.map((algorithm, index) => (
            <motion.div
              key={algorithm.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  {algorithm.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  algorithm.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  algorithm.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {algorithm.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{algorithm.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{algorithm.description}</p>
              <Link
                to={`/algorithms/${algorithm.name.toLowerCase().replace(' ', '-')}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/algorithms"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            View All Algorithms
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6"
            >
              <Zap className="w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Master Algorithms?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have improved their algorithmic thinking with our interactive platform.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 