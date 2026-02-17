import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Circle, Triangle, X } from 'lucide-react'

const AnswerTile = ({ candidates }: { candidates: any }) => {
  return (
    <div>
      <Card>
        <Tabs defaultValue="yes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="yes"><Circle /></TabsTrigger>
            <TabsTrigger value="maybe"><Triangle /></TabsTrigger>
            <TabsTrigger value="no"><X /></TabsTrigger>
          </TabsList>
        </Tabs>
        <div>Tag Section</div>
      </Card>
    </div>
  )
}

export default AnswerTile