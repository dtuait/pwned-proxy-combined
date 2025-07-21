from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_endpointlog'),
    ]

    operations = [
        migrations.RenameField(
            model_name='apikey',
            old_name='hashed_key',
            new_name='key',
        ),
    ]
