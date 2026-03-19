export function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-blue-500 ml-0.5">*</span>}
    </label>
  );
}