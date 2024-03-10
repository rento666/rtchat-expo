const ITEMS = 
  {
    key: 'default',
    name: '朋友关系',
    title: '给朋友的标签',
    value:[{
      key: 'friend',
      type: 'radio',
      title: '朋友',
      text: '彼此之间有一定的了解和信任。'
    },{
      key: 'family',
      type: 'radio',
      title: '家人',
      text: '血缘关系或社会关系紧密的人。'
    },{
      key: 'colleague',
      type: 'radio',
      title: '同事',
      text: '在同一个单位工作的人。'
    },{
      key: 'classmate',
      type: 'radio',
      title: '同学',
      text: '在同一所学校学习的人。'
    },{
      key: 'other',
      type: 'radio',
      title: '其他',
      text: '与朋友关系不大的其他人。'
    }],
    button:'保存标签'
  }


export default ITEMS;