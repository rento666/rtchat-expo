import React from "react";
import { Text } from "react-native";
// 搜索词高亮

export const TextHighLighter = (props) => {
  const {title = '', highLightWords = []} = props;
  const { numberOfLines = 1, ellipsizeMode } = props;
  const { style } = props;
  const { hightLigthColor = 'blue' } = props;

  const { value, keyword } = markKeywords(title, highLightWords);

  return <Text
           numberOfLines={numberOfLines}
           ellipsizeMode={ellipsizeMode}
           style={style}
         >
          {
            value ?
              value.map((item,index) => (
                (keyword && keyword.some(i => (i.toLocaleUpperCase().includes(item) || i.toLowerCase().includes(item))))
                ? <Text key={index} style={{color: hightLigthColor}}>{item}</Text>
                : item
              ))
            : null
          }
  </Text>
};

function sort(letter, substr) {
  letter = letter.toLocaleUpperCase()
  substr = substr.toLocaleUpperCase()
  var pos = letter.indexOf(substr)
  var positions = []
  while(pos > -1) {
     positions.push(pos)
     pos = letter.indexOf(substr, pos + 1)
  }

  return positions.map(item => ([item, item + substr.length]))
};

// 高亮词第一次遍历索引
function format (text, hight) {
  var arr = []
  // hight.push(hight.reduce((prev, curr) => prev+curr), '')
  hight.forEach((item, index) => {
    arr.push(sort(text, item))
  })

  return arr.reduce((acc, val) => acc.concat(val), []);
};

// 合并索引区间
var merge = function(intervals) {
  const n = intervals.length;

  if (n <= 1) {
      return intervals;
  }

  intervals.sort((a, b) => a[0] - b[0]);

  let refs = [];
  refs.unshift([intervals[0][0], intervals[0][1]]);

  for (let i = 1; i < n; i++) {
      let ref = refs[0];

      if (intervals[i][0] < ref[1]) {
          ref[1] = Math.max(ref[1], intervals[i][1]);
      } else {
          refs.unshift([intervals[i][0], intervals[i][1]]);
      }
  }

  return refs.sort((a,b) => a[0] - b[0]);
};

function getHightLightWord (text, hight) {
  var bj = merge(format(text, hight))
  const c = text.split('')
  var bjindex = 0
  try {
    bj.forEach((item, index) => {
      item.forEach((_item, _index) => {
          c.splice(_item + bjindex, 0, '**')
          bjindex+=1
      })
    })
  } catch (error) {
  }
  return c.join('').split('**')
};

const markKeywords = (text, keyword) => {

  if (!text || !keyword || keyword.length === 0 ) {
    return { value: [text], keyword: [] }
  }
  if (Array.isArray(keyword)) {
    keyword = keyword.filter(item => item)
  }
  let obj = { value: [text], keyword };
  obj = {
    value: getHightLightWord(text, keyword).filter((item) => item),
    keyword: keyword.map((item) => item.toLocaleUpperCase()),
  };
  return obj;
};

