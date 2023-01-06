// 所有通用函数请放置于此

/**
 * ### 获取一个从min到max的随机数
 * @param min 确定最小值 
 * @param max 确定最大值 
 * @returns 返回一个number
 */
function getRandom(min, max) {return Math.random() * (max - min) + min;}