const requireAll = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)

const re = /\.\/(.*)\.svg/

const requireIconsName = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys()

const icons = requireIconsName(req).map((i: any) => {
  return i.match(re)[1]
})

export default icons
