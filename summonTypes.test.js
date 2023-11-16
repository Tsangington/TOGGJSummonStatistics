const { RedSummons, AncientSummons } = require('./summonTypes')

test('Normal/Red/Destiny sortRarities is working correctly', () => {
  const summonData = [
    ['Bone Stick', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
    ['Yura Ha', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
    ['Wide Spear', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
    ['Xiaxia', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
    ['Rapier', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
    ['Alphine', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
    ['Cassano', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
    ['Wangnan Ja', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
    ['Maschenny Sword', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"]
  ]
  const testSummonObject = new RedSummons(summonData)
  return expect(testSummonObject.sortRarities(summonData)).toStrictEqual([['Yura Ha', 'Xiaxia', 'Cassano', 'Maschenny Sword'], ['Alphine', 'Wangnan Ja']])
})

test('Ancient sortRarities is working correctly', () => {
  const summonData = [
    ['Jahad', 'Great King of the Tower'],
    ['Golden Needle of Genuine Light', 'Great King of the Tower'],
    ['Wide Spear', 'Great King of the Tower'],
    ['Xiaxia', 'Great King of the Tower'],
    ['Rapier', 'Great King of the Tower'],
    ['Alphine', 'Great King of the Tower'],
    ['Cassano', 'Great King of the Tower'],
    ['Wangnan Ja', 'Great King of the Tower'],
    ['Maschenny Sword', 'Great King of the Tower']
  ]
  const testSummonObject = new AncientSummons(summonData)
  return expect(testSummonObject.sortRarities(summonData)).toStrictEqual([['Jahad', 'Golden Needle of Genuine Light'], ['Xiaxia', 'Cassano', 'Maschenny Sword'], ['Alphine', 'Wangnan Ja']])
})
