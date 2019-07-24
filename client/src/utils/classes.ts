/**
 * Helper to concatenate conditional CSS classes
 * E.g.
 * classes("class_1", false && "class_2", true && "class_3")
 *   -> "class_1 class_3"
 */
export default function classes(...css: any[]) {
  return css.filter(c => c).join(' ');
}
