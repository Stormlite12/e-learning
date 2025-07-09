import React from 'react'
import AppHeader from '../../workspace/_components/AppHeader'
import ChapterListSidebar from '../_components/ChapterListSidebar'
import ChapterContent from '../_components/ChapterContent'
function Course() {
  return (
    <div>
        <AppHeader hideSidebar={true}/>
        <div className='flex gap-10'>
            <ChapterListSidebar/>
            <ChapterContent/>
        </div>
    </div>
  )
}

export default Course