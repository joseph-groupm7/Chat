<?php

use Phinx\Migration\AbstractMigration;

class CreateMessages extends AbstractMigration
{
    /**
     * Change Method.
     *
     * More information on this method is available here:
     * http://docs.phinx.org/en/latest/migrations.html#the-change-method
     *
     * Uncomment this method if you would like to use it.
     *
    public function change()
    {
    }
    */
    
    /**
     * Migrate Up.
     */
    public function up()
    {
        $messages = $this->table('messages');
        $messages->addColumn('name', 'string')
                 ->addColumn('message', 'string')
                 ->addColumn('room_id', 'integer')
                 ->addForeignKey('room_id', 'rooms', 'id', array('delete' => 'CASCADE'))
                 ->addColumn('created_at', 'timestamp')
                 ->save();

    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->dropTable('messages');
    }
}