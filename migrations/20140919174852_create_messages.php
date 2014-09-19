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
        $messages->addColumn('text', 'string')
                 ->addColumn('chat_id', 'integer')
                 ->addForeignKey('chat_id', 'chats', 'id', array('delete' => 'CASCADE'))
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